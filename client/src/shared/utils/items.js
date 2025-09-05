const users = [
  { "id": 1, "name": "Sarah Johnson", "avatar": null },
  { "id": 2, "name": "Mike Chen", "avatar": null },
  { "id": 3, "name": "Emma Wilson", "avatar": null },
  { "id": 4, "name": "David Rodriguez", "avatar": null },
  { "id": 5, "name": "Lisa Park", "avatar": null },
  { "id": 6, "name": "Alex Thompson", "avatar": null },
  { "id": 7, "name": "Jordan Smith", "avatar": null },
  { "id": 8, "name": "Casey Brown", "avatar": null }
];

const items = [
  { "id": 1, "name": "Vintage Leather Jacket", "zipcode": "90210", "radius": 30, "description": "Classic leather jacket in great condition", "category": "clothing", "image": null, "ownerId": 1, "estimatedValue": 180 },
  { "id": 2, "name": "Nintendo Switch Console", "zipcode": "10001", "radius": 25, "description": "Barely used gaming console with accessories", "category": "electronics", "image": null, "ownerId": 2, "estimatedValue": 280 },
  { "id": 3, "name": "Wooden Coffee Table", "zipcode": "90210", "radius": 5, "description": "Handmade oak coffee table", "category": "furniture", "image": null, "ownerId": 3, "estimatedValue": 320 },
  { "id": 4, "name": "Mountain Bike", "zipcode": "10001", "radius": 15, "description": "Trek mountain bike, excellent condition", "category": "sports", "image": null, "ownerId": 4, "estimatedValue": 450 },
  { "id": 5, "name": "Guitar Acoustic", "zipcode": "33101", "radius": 20, "description": "Yamaha acoustic guitar with case", "category": "music", "image": null, "ownerId": 5, "estimatedValue": 220 },
  { "id": 6, "name": "MacBook Pro", "zipcode": "60601", "radius": 40, "description": "2021 MacBook Pro M1, excellent condition", "category": "electronics", "image": null, "ownerId": 6, "estimatedValue": 1200 },
  { "id": 7, "name": "Designer Handbag", "zipcode": "94102", "radius": 10, "description": "Authentic Louis Vuitton handbag", "category": "clothing", "image": null, "ownerId": 7, "estimatedValue": 800 },
  { "id": 8, "name": "Exercise Equipment", "zipcode": "77001", "radius": 35, "description": "Home gym set with weights", "category": "sports", "image": null, "ownerId": 8, "estimatedValue": 350 },
  { "id": 9, "name": "Antique Dresser", "zipcode": "75201", "radius": 20, "description": "Victorian era wooden dresser", "category": "furniture", "image": null, "ownerId": 1, "estimatedValue": 650 },
  { "id": 10, "name": "Canon Camera", "zipcode": "02101", "radius": 25, "description": "DSLR camera with lenses", "category": "electronics", "image": null, "ownerId": 2, "estimatedValue": 750 },
  { "id": 11, "name": "Surfboard", "zipcode": "98101", "radius": 15, "description": "Custom surfboard, perfect for beginners", "category": "sports", "image": null, "ownerId": 3, "estimatedValue": 400 },
  { "id": 12, "name": "Art Collection", "zipcode": "30301", "radius": 30, "description": "Original paintings and prints", "category": "other", "image": null, "ownerId": 4, "estimatedValue": 500 },
  { "id": 13, "name": "San Jose Tech Gadgets", "zipcode": "95192", "radius": 15, "description": "Various tech accessories and gadgets", "category": "electronics", "image": null, "ownerId": 5, "estimatedValue": 150 },
  { "id": 14, "name": "Local Furniture Set", "zipcode": "95192", "radius": 10, "description": "Modern living room furniture", "category": "furniture", "image": null, "ownerId": 6, "estimatedValue": 900 },
  { "id": 15, "name": "Bay Area Books", "zipcode": "95192", "radius": 20, "description": "Collection of programming and tech books", "category": "books", "image": null, "ownerId": 7, "estimatedValue": 80 },
  { "id": 16, "name": "Gaming Setup", "zipcode": "95112", "radius": 25, "description": "Complete gaming rig with RGB lighting", "category": "electronics", "image": null, "ownerId": 8, "estimatedValue": 1500 },
  { "id": 17, "name": "Vintage Vinyl Records", "zipcode": "95126", "radius": 30, "description": "Collection of classic rock and jazz vinyl", "category": "music", "image": null, "ownerId": 1, "estimatedValue": 300 },
  { "id": 18, "name": "Professional Bike", "zipcode": "95118", "radius": 15, "description": "Trek road bike, barely used", "category": "sports", "image": null, "ownerId": 2, "estimatedValue": 800 },
  { "id": 19, "name": "Art Supplies Kit", "zipcode": "95110", "radius": 20, "description": "Complete set of professional art supplies", "category": "other", "image": null, "ownerId": 3, "estimatedValue": 120 },
  { "id": 20, "name": "Kitchen Appliances", "zipcode": "95124", "radius": 12, "description": "Blender, toaster, and coffee maker", "category": "other", "image": null, "ownerId": 4, "estimatedValue": 200 },
  { "id": 21, "name": "Designer Shoes", "zipcode": "95127", "radius": 18, "description": "Brand new Nike and Adidas collection", "category": "clothing", "image": null, "ownerId": 5, "estimatedValue": 250 },
  { "id": 22, "name": "Home Theater System", "zipcode": "95132", "radius": 35, "description": "5.1 surround sound system", "category": "electronics", "image": null, "ownerId": 6, "estimatedValue": 600 },
  { "id": 23, "name": "Garden Tools", "zipcode": "95136", "radius": 22, "description": "Complete gardening toolkit", "category": "other", "image": null, "ownerId": 7, "estimatedValue": 90 },
  { "id": 24, "name": "Workout Equipment", "zipcode": "95148", "radius": 28, "description": "Dumbbells and yoga mats", "category": "sports", "image": null, "ownerId": 8, "estimatedValue": 180 },
  { "id": 25, "name": "Baby Gear", "zipcode": "95123", "radius": 15, "description": "Stroller, car seat, and toys", "category": "other", "image": null, "ownerId": 1, "estimatedValue": 300 }
]

export const getItems = () => [...items]

export const getUsers = () => [...users]

export const getUserById = (userId) => users.find(user => user.id === userId)

export const addItem = (newItem) => {
  const item = {
    ...newItem,
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
    ownerId: Math.floor(Math.random() * users.length) + 1 // Random owner for demo
  }
  items.push(item)
  return item
}

export const findSimilarItems = (targetItem) => {
  if (!targetItem.name || !targetItem.description) return []
  
  const targetWords = (targetItem.name + ' ' + targetItem.description).toLowerCase().split(' ')
  
  return items
    .filter(item => item.id !== targetItem.id)
    .map(item => {
      const itemWords = (item.name + ' ' + item.description).toLowerCase().split(' ')
      
      let score = 0
      
      // Category match bonus
      if (item.category === targetItem.category) score += 50
      
      // Word matching
      targetWords.forEach(word => {
        if (word.length > 2 && itemWords.some(iWord => iWord.includes(word) || word.includes(iWord))) {
          score += 10
        }
      })
      
      // Distance penalty (assuming same zipcode for now)
      if (item.zipcode === targetItem.zipcode) score += 20
      
      return { ...item, similarityScore: score }
    })
    .filter(item => item.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
}

export default getItems
