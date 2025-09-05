const items = [
  { "id": 1, "name": "Vintage Leather Jacket", "zipcode": "90210", "radius": 30, "description": "Classic leather jacket in great condition", "category": "clothing", "image": null },
  { "id": 2, "name": "Nintendo Switch Console", "zipcode": "10001", "radius": 25, "description": "Barely used gaming console with accessories", "category": "electronics", "image": null },
  { "id": 3, "name": "Wooden Coffee Table", "zipcode": "90210", "radius": 5, "description": "Handmade oak coffee table", "category": "furniture", "image": null },
  { "id": 4, "name": "Mountain Bike", "zipcode": "10001", "radius": 15, "description": "Trek mountain bike, excellent condition", "category": "sports", "image": null },
  { "id": 5, "name": "Guitar Acoustic", "zipcode": "33101", "radius": 20, "description": "Yamaha acoustic guitar with case", "category": "music", "image": null }
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
