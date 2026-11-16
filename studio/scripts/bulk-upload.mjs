/**
 * Bulk product uploader.
 *
 *   npm run upload:check   → shows what would be uploaded, changes nothing
 *   npm run upload         → uploads images and creates the products
 *
 * Folder layout (default: ~/Desktop/Upload-innovation, or pass a path):
 *
 *   Sofa/Product 8/photo-1.jpg, photo-2.jpg …     ← one folder per product
 *   products.csv                                   ← one row per product folder
 *
 * New product folders are added to products.csv automatically; fill in the
 * name and price, then run again. Products already in Sanity are skipped.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {createClient} from '@sanity/client'

const args = process.argv.slice(2).filter((a) => a !== '--')
const CHECK_ONLY = args.includes('--check')
const ROOT = path.resolve(
  args.find((a) => !a.startsWith('--')) ?? path.join(os.homedir(), 'Desktop', 'Upload-innovation'),
)
const CSV_PATH = path.join(ROOT, 'products.csv')
const COLUMNS = ['folder', 'name', 'category', 'price', 'materials', 'dimensions', 'description']
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i

/** Uses SANITY_TOKEN if set, otherwise your `sanity login` session on this Mac. */
function readToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN
  try {
    const cfg = path.join(os.homedir(), '.config', 'sanity', 'config.json')
    return JSON.parse(fs.readFileSync(cfg, 'utf8')).authToken
  } catch {
    return undefined
  }
}

const token = CHECK_ONLY ? undefined : readToken()
const client = createClient({
  projectId: 'k99v89m4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// ─── CSV ───────────────────────────────────────────────────────────────────────

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some((v) => v.trim())) rows.push(row)
      row = []
    } else cell += c
  }
  row.push(cell)
  if (row.some((v) => v.trim())) rows.push(row)
  return rows
}

const csvCell = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
const toCsv = (rows) => rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n'

// ─── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90)

const simple = (s) => s.toLowerCase().replace(/[^a-z]/g, '').replace(/s$/, '')

const natural = (a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'})

/** Every folder under ROOT named like "Product 3" — i.e. two levels deep with images inside. */
function findProductFolders() {
  const found = []
  for (const top of fs.readdirSync(ROOT, {withFileTypes: true})) {
    if (!top.isDirectory() || top.name.startsWith('.')) continue
    for (const sub of fs.readdirSync(path.join(ROOT, top.name), {withFileTypes: true})) {
      if (!sub.isDirectory() || sub.name.startsWith('.')) continue
      found.push(`${top.name}/${sub.name}`)
    }
  }
  return found.sort(natural)
}

/** Images in a product folder, in filename order. Same photo saved twice (a.jpg + a.png) is used once. */
function listImages(folder) {
  const dir = path.join(ROOT, folder)
  const files = []
  const skipped = []
  const seen = new Set()
  for (const name of fs.readdirSync(dir).sort(natural)) {
    if (name.startsWith('.')) continue
    const stem = name.replace(/(\.(jpe?g|png|webp))+$/i, '').toLowerCase()
    if (!IMAGE_EXT.test(name)) skipped.push(`${name} (not a .jpg/.png/.webp file)`)
    else if (seen.has(stem)) skipped.push(`${name} (duplicate of another file)`)
    else { seen.add(stem); files.push(name) }
  }
  return {files, skipped}
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(ROOT)) throw new Error(`Folder not found: ${ROOT}`)
  if (!CHECK_ONLY && !token) {
    throw new Error('Not logged in to Sanity. Run "npx sanity login" in the studio folder once, then try again.')
  }
  console.log(`\nFolder: ${ROOT}${CHECK_ONLY ? '   (check only — nothing will be changed)' : ''}\n`)

  const [categories, existingSlugs] = await Promise.all([
    client.fetch(`*[_type == "category"]{_id, name, "slug": slug.current}`),
    client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))].slug.current`),
  ])
  const findCategory = (value) =>
    categories.find((c) => simple(c.slug) === simple(value) || simple(c.name) === simple(value))

  // 1. Load the spreadsheet and add a row for every product folder that isn't in it yet.
  let rows = []
  if (fs.existsSync(CSV_PATH)) {
    const [header, ...body] = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'))
    const keys = header.map((h) => h.trim().toLowerCase())
    rows = body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])))
  }
  const listed = new Set(rows.map((r) => r.folder))
  const added = findProductFolders().filter((f) => !listed.has(f) && listImages(f).files.length > 0)
  for (const folder of added) {
    rows.push({folder, category: findCategory(folder.split('/')[0])?.slug ?? ''})
  }
  if (added.length) {
    fs.writeFileSync(CSV_PATH, toCsv([COLUMNS, ...rows.map((r) => COLUMNS.map((c) => r[c] ?? ''))]))
    console.log(`Added ${added.length} new folder(s) to products.csv:\n  ${added.join('\n  ')}\n`)
  }

  // 2. Go through each row.
  let created = 0
  let skipped = 0
  let needsInfo = 0
  const usedSlugs = new Set(existingSlugs)

  for (const row of rows) {
    const label = row.name || row.folder
    const price = Number((row.price ?? '').replace(/[^\d.]/g, ''))
    const category = findCategory(row.category ?? '')
    const dir = path.join(ROOT, row.folder ?? '')

    const problems = []
    if (!row.name) problems.push('name is empty')
    if (!row.price || !Number.isFinite(price) || price <= 0) problems.push('price is empty')
    if (!category) problems.push(`category "${row.category ?? ''}" not found (use: ${categories.map((c) => c.slug).join(', ')})`)
    if (!row.folder || !fs.existsSync(dir)) problems.push(`folder "${row.folder}" not found`)
    if (problems.length) {
      console.log(`•  FILL IN  ${label} — ${problems.join('; ')}`)
      needsInfo++
      continue
    }

    const slug = slugify(row.name)
    if (usedSlugs.has(slug)) {
      console.log(`–  skip     ${label} — already on the website`)
      skipped++
      continue
    }

    const {files, skipped: ignored} = listImages(row.folder)
    if (files.length === 0) {
      console.log(`•  FILL IN  ${label} — no images in ${row.folder}`)
      needsInfo++
      continue
    }
    for (const note of ignored) console.log(`     ignoring ${note}`)

    if (CHECK_ONLY) {
      console.log(`+  ready    ${label} — ${category.name}, ₹${price.toLocaleString('en-IN')}, ${files.length} image(s)`)
      created++
      usedSlugs.add(slug)
      continue
    }

    process.stdout.write(`+  upload   ${label} `)
    const images = []
    for (const [i, file] of files.entries()) {
      const asset = await client.assets.upload('image', fs.createReadStream(path.join(dir, file)), {filename: file})
      images.push({
        _type: 'image',
        _key: asset._id.slice(-12) + i,
        asset: {_type: 'reference', _ref: asset._id},
        alt: i === 0 ? `${row.name} — ${category.name} by Innovation Designer Furniture` : `${row.name} — view ${i + 1}`,
      })
      process.stdout.write('.')
    }
    await client.create({
      _id: `product-${slug}`,
      _type: 'product',
      name: row.name,
      slug: {_type: 'slug', current: slug},
      category: {_type: 'reference', _ref: category._id},
      starting_price: price,
      ...(row.description && {description: row.description}),
      ...(row.materials && {materials: row.materials}),
      ...(row.dimensions && {dimensions: row.dimensions}),
      images,
    })
    console.log(` done → /products/${slug}`)
    created++
    usedSlugs.add(slug)
  }

  console.log(
    `\n${CHECK_ONLY ? 'Ready to upload' : 'Uploaded'}: ${created}   Already on site: ${skipped}   Need details in products.csv: ${needsInfo}\n`,
  )
  if (needsInfo) console.log(`Open ${CSV_PATH}, fill in the missing cells, save, and run again.\n`)
}

main().catch((err) => {
  console.error(`\nUpload stopped: ${err.message}\n`)
  process.exit(1)
})
