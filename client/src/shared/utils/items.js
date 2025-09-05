const items = [
  { "id": 1, "name": "Vintage Leather Jacket", "zipcode": "90210", "radius": 30, "description": "Classic leather jacket in great condition", "category": "clothing", "image": null },
  { "id": 2, "name": "Nintendo Switch Console", "zipcode": "10001", "radius": 25, "description": "Barely used gaming console with accessories", "category": "electronics", "image": null },
  { "id": 3, "name": "Wooden Coffee Table", "zipcode": "90210", "radius": 5, "description": "Handmade oak coffee table", "category": "furniture", "image": null },
  { "id": 4, "name": "Mountain Bike", "zipcode": "10001", "radius": 15, "description": "Trek mountain bike, excellent condition", "category": "sports", "image": null },
  { "id": 5, "name": "Guitar Acoustic", "zipcode": "33101", "radius": 20, "description": "Yamaha acoustic guitar with case", "category": "music", "image": null },
  { "id": 6, "name": "MacBook Pro", "zipcode": "60601", "radius": 40, "description": "2021 MacBook Pro M1, excellent condition", "category": "electronics", "image": null },
  { "id": 7, "name": "Designer Handbag", "zipcode": "94102", "radius": 10, "description": "Authentic Louis Vuitton handbag", "category": "clothing", "image": null },
  { "id": 8, "name": "Exercise Equipment", "zipcode": "77001", "radius": 35, "description": "Home gym set with weights", "category": "sports", "image": null },
  { "id": 9, "name": "Antique Dresser", "zipcode": "75201", "radius": 20, "description": "Victorian era wooden dresser", "category": "furniture", "image": null },
  { "id": 10, "name": "Canon Camera", "zipcode": "02101", "radius": 25, "description": "DSLR camera with lenses", "category": "electronics", "image": null },
  { "id": 11, "name": "Surfboard", "zipcode": "98101", "radius": 15, "description": "Custom surfboard, perfect for beginners", "category": "sports", "image": null },
  { "id": 12, "name": "Art Collection", "zipcode": "30301", "radius": 30, "description": "Original paintings and prints", "category": "other", "image": null },
  // Add some flexible entries that can match any zipcode
  { "id": 13, "name": "San Jose Tech Gadgets", "zipcode": "95192", "radius": 15, "description": "Various tech accessories and gadgets", "category": "electronics", "image": null },
  { "id": 14, "name": "Local Furniture Set", "zipcode": "95192", "radius": 10, "description": "Modern living room furniture", "category": "furniture", "image": null },
  { "id": 15, "name": "Bay Area Books", "zipcode": "95192", "radius": 20, "description": "Collection of programming and tech books", "category": "books", "image": null }
]

export const getItems = () => [...items]

export const addItem = (newItem) => {
  const item = {
    ...newItem,
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
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
