import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categories = [
    {
      name: "Vegetables",
      slug: "vegetables",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa68c5e47",
      products: [
        { name: "Fresh Tomatoes", price: 30, compareAt: 40, unit: "1 KG", stock: 100 },
        { name: "Potatoes", price: 25, compareAt: 35, unit: "1 KG", stock: 150 },
        { name: "Onions", price: 28, compareAt: 38, unit: "1 KG", stock: 150 },
        { name: "Spinach", price: 15, compareAt: 20, unit: "1 Bunch", stock: 80 },
        { name: "Cauliflower", price: 35, compareAt: 45, unit: "1 Piece", stock: 60 },
        { name: "Cabbage", price: 20, compareAt: 28, unit: "1 Piece", stock: 70 },
        { name: "Broccoli", price: 55, compareAt: 70, unit: "1 KG", stock: 50 },
        { name: "Cucumber", price: 25, compareAt: 32, unit: "1 KG", stock: 90 },
        { name: "Carrots", price: 30, compareAt: 38, unit: "1 KG", stock: 100 },
        { name: "Beetroot", price: 35, compareAt: 45, unit: "1 KG", stock: 60 },
        { name: "Green Beans", price: 40, compareAt: 50, unit: "1 KG", stock: 70 },
        { name: "Peas", price: 45, compareAt: 55, unit: "1 KG", stock: 65 },
        { name: "Bell Pepper Red", price: 60, compareAt: 78, unit: "1 KG", stock: 50 },
        { name: "Bell Pepper Green", price: 40, compareAt: 55, unit: "1 KG", stock: 55 },
        { name: "Bell Pepper Yellow", price: 70, compareAt: 88, unit: "1 KG", stock: 40 },
        { name: "Brinjal / Eggplant", price: 25, compareAt: 35, unit: "1 KG", stock: 75 },
        { name: "Ladyfinger / Okra", price: 30, compareAt: 40, unit: "1 KG", stock: 80 },
        { name: "Bitter Gourd", price: 35, compareAt: 45, unit: "1 KG", stock: 45 },
        { name: "Bottle Gourd", price: 22, compareAt: 30, unit: "1 Piece", stock: 55 },
        { name: "Ridge Gourd", price: 28, compareAt: 38, unit: "1 KG", stock: 50 },
        { name: "Pumpkin", price: 20, compareAt: 28, unit: "1 KG", stock: 40 },
        { name: "Sweet Potato", price: 40, compareAt: 50, unit: "1 KG", stock: 60 },
        { name: "Radish", price: 20, compareAt: 28, unit: "1 KG", stock: 65 },
        { name: "Turnip", price: 25, compareAt: 35, unit: "1 KG", stock: 45 },
        { name: "Zucchini", price: 50, compareAt: 65, unit: "1 KG", stock: 40 },
        { name: "Celery", price: 45, compareAt: 58, unit: "1 Bunch", stock: 35 },
        { name: "Lettuce Iceberg", price: 35, compareAt: 45, unit: "1 Piece", stock: 50 },
        { name: "Mushrooms", price: 80, compareAt: 100, unit: "250 GM", stock: 40 },
        { name: "Corn on Cob", price: 25, compareAt: 35, unit: "1 Piece", stock: 80 },
        { name: "Asparagus", price: 120, compareAt: 150, unit: "1 Bunch", stock: 30 },
        { name: "Artichoke", price: 90, compareAt: 110, unit: "1 Piece", stock: 25 },
        { name: "Spring Onions", price: 18, compareAt: 25, unit: "1 Bunch", stock: 70 },
        { name: "Green Chili", price: 12, compareAt: 18, unit: "250 GM", stock: 100 },
        { name: "Ginger", price: 40, compareAt: 55, unit: "250 GM", stock: 80 },
        { name: "Garlic", price: 35, compareAt: 48, unit: "250 GM", stock: 90 },
        { name: "Raw Banana", price: 20, compareAt: 28, unit: "1 KG", stock: 55 },
        { name: "Tapioca / Cassava", price: 30, compareAt: 40, unit: "1 KG", stock: 35 },
        { name: "Colocasia / Arbi", price: 35, compareAt: 45, unit: "1 KG", stock: 40 },
        { name: "Yam / Suran", price: 28, compareAt: 38, unit: "1 KG", stock: 30 },
        { name: "Drumsticks", price: 25, compareAt: 35, unit: "1 Bunch", stock: 35 },
        { name: "Fenugreek Leaves", price: 15, compareAt: 22, unit: "1 Bunch", stock: 50 },
        { name: "Coriander Leaves", price: 10, compareAt: 15, unit: "1 Bunch", stock: 100 },
        { name: "Mint Leaves", price: 12, compareAt: 18, unit: "1 Bunch", stock: 80 },
        { name: "Curry Leaves", price: 8, compareAt: 12, unit: "1 Bunch", stock: 90 },
        { name: "Dill Leaves", price: 15, compareAt: 22, unit: "1 Bunch", stock: 35 },
        { name: "Sorrel Leaves", price: 18, compareAt: 25, unit: "1 Bunch", stock: 30 },
        { name: "Jackfruit Raw", price: 45, compareAt: 60, unit: "1 KG", stock: 25 },
        { name: "Snow Peas", price: 65, compareAt: 80, unit: "1 KG", stock: 30 },
        { name: "Baby Corn", price: 70, compareAt: 88, unit: "1 KG", stock: 35 },
        { name: "Red Cabbage", price: 30, compareAt: 40, unit: "1 Piece", stock: 40 },
      ],
    },
    {
      name: "Fruits",
      slug: "fruits",
      image: "https://images.unsplash.com/photo-1619566626922-71c5935a3e8c",
      products: [
        { name: "Red Apples", price: 150, compareAt: 180, unit: "1 KG", stock: 80 },
        { name: "Green Apples", price: 130, compareAt: 160, unit: "1 KG", stock: 60 },
        { name: "Bananas", price: 30, compareAt: 40, unit: "1 Dozen", stock: 150 },
        { name: "Oranges", price: 80, compareAt: 100, unit: "1 KG", stock: 90 },
        { name: "Sweet Lime / Mosambi", price: 60, compareAt: 78, unit: "1 KG", stock: 70 },
        { name: "Grapes Green", price: 70, compareAt: 90, unit: "1 KG", stock: 65 },
        { name: "Grapes Black", price: 85, compareAt: 105, unit: "1 KG", stock: 55 },
        { name: "Pomegranate", price: 120, compareAt: 148, unit: "1 KG", stock: 60 },
        { name: "Mango Alphonso", price: 250, compareAt: 300, unit: "1 Dozen", stock: 40 },
        { name: "Mango Totapuri", price: 120, compareAt: 150, unit: "1 KG", stock: 50 },
        { name: "Watermelon", price: 30, compareAt: 40, unit: "1 KG", stock: 35 },
        { name: "Muskmelon", price: 50, compareAt: 65, unit: "1 Piece", stock: 30 },
        { name: "Papaya", price: 45, compareAt: 58, unit: "1 Piece", stock: 45 },
        { name: "Pineapple", price: 80, compareAt: 100, unit: "1 Piece", stock: 35 },
        { name: "Strawberries", price: 200, compareAt: 250, unit: "1 Box", stock: 30 },
        { name: "Blueberries", price: 350, compareAt: 420, unit: "1 Box", stock: 20 },
        { name: "Kiwi", price: 180, compareAt: 220, unit: "1 KG", stock: 40 },
        { name: "Avocado", price: 220, compareAt: 270, unit: "1 KG", stock: 35 },
        { name: "Guava", price: 50, compareAt: 65, unit: "1 KG", stock: 55 },
        { name: "Lychee", price: 180, compareAt: 220, unit: "1 KG", stock: 25 },
        { name: "Sapota / Chikoo", price: 60, compareAt: 78, unit: "1 KG", stock: 40 },
        { name: "Custard Apple", price: 100, compareAt: 130, unit: "1 KG", stock: 30 },
        { name: "Dragon Fruit", price: 160, compareAt: 200, unit: "1 KG", stock: 25 },
        { name: "Dates Fresh", price: 200, compareAt: 250, unit: "1 KG", stock: 35 },
        { name: "Figs / Anjeer", price: 280, compareAt: 340, unit: "1 KG", stock: 20 },
        { name: "Plums", price: 120, compareAt: 150, unit: "1 KG", stock: 35 },
        { name: "Peaches", price: 160, compareAt: 195, unit: "1 KG", stock: 30 },
        { name: "Pears", price: 140, compareAt: 175, unit: "1 KG", stock: 40 },
        { name: "Cherries", price: 350, compareAt: 420, unit: "1 KG", stock: 20 },
        { name: "Coconut Tender", price: 35, compareAt: 50, unit: "1 Piece", stock: 60 },
        { name: "Coconut Mature", price: 40, compareAt: 55, unit: "1 Piece", stock: 50 },
        { name: "Jackfruit Ripe", price: 80, compareAt: 100, unit: "1 KG", stock: 20 },
        { name: "Raspberries", price: 380, compareAt: 450, unit: "1 Box", stock: 15 },
        { name: "Blackberries", price: 360, compareAt: 430, unit: "1 Box", stock: 15 },
        { name: "Cranberries", price: 320, compareAt: 390, unit: "1 Box", stock: 18 },
        { name: "Passion Fruit", price: 250, compareAt: 300, unit: "1 KG", stock: 20 },
        { name: "Rambutan", price: 220, compareAt: 270, unit: "1 KG", stock: 15 },
        { name: "Star Fruit", price: 90, compareAt: 115, unit: "1 KG", stock: 22 },
        { name: "Tangerine", price: 100, compareAt: 125, unit: "1 KG", stock: 35 },
        { name: "Pomelo", price: 85, compareAt: 110, unit: "1 Piece", stock: 22 },
        { name: "Apricots", price: 200, compareAt: 250, unit: "1 KG", stock: 20 },
        { name: "Cantaloupe", price: 55, compareAt: 72, unit: "1 Piece", stock: 25 },
        { name: "Honeydew Melon", price: 60, compareAt: 78, unit: "1 Piece", stock: 22 },
        { name: "Mulberries", price: 150, compareAt: 190, unit: "1 Box", stock: 18 },
        { name: "Longan", price: 240, compareAt: 290, unit: "1 KG", stock: 15 },
        { name: "Mangosteen", price: 350, compareAt: 420, unit: "1 KG", stock: 12 },
        { name: "Gooseberry / Amla", price: 80, compareAt: 100, unit: "1 KG", stock: 30 },
        { name: "Java Plum / Jamun", price: 120, compareAt: 150, unit: "1 KG", stock: 20 },
        { name: "Cactus Pear", price: 110, compareAt: 140, unit: "1 KG", stock: 15 },
        { name: "Kiwano / Horned Melon", price: 180, compareAt: 225, unit: "1 Piece", stock: 10 },
      ],
    },
    {
      name: "Dairy & Eggs",
      slug: "dairy-eggs",
      image: "https://images.unsplash.com/photo-1628088062854-b1870b1f6b9f",
      products: [
        { name: "Fresh Cow Milk", price: 60, compareAt: 75, unit: "1 Ltr", stock: 100 },
        { name: "Toned Milk", price: 50, compareAt: 62, unit: "1 Ltr", stock: 120 },
        { name: "Full Cream Milk", price: 68, compareAt: 84, unit: "1 Ltr", stock: 90 },
        { name: "Curd / Yogurt", price: 40, compareAt: 50, unit: "500 GM", stock: 80 },
        { name: "Greek Yogurt", price: 85, compareAt: 105, unit: "500 GM", stock: 40 },
        { name: "Buttermilk", price: 25, compareAt: 35, unit: "1 Ltr", stock: 70 },
        { name: "Fresh Paneer", price: 120, compareAt: 150, unit: "250 GM", stock: 50 },
        { name: "Smoked Paneer", price: 150, compareAt: 185, unit: "250 GM", stock: 30 },
        { name: "Mozzarella Cheese", price: 180, compareAt: 220, unit: "200 GM", stock: 40 },
        { name: "Cheddar Cheese", price: 200, compareAt: 250, unit: "200 GM", stock: 35 },
        { name: "Processed Cheese", price: 95, compareAt: 120, unit: "200 GM", stock: 60 },
        { name: "Cream Cheese", price: 160, compareAt: 200, unit: "200 GM", stock: 30 },
        { name: "Butter Unsalted", price: 55, compareAt: 70, unit: "100 GM", stock: 70 },
        { name: "Butter Salted", price: 55, compareAt: 70, unit: "100 GM", stock: 65 },
        { name: "Ghee Clarified", price: 280, compareAt: 350, unit: "500 ML", stock: 45 },
        { name: "Fresh Cream", price: 65, compareAt: 82, unit: "200 ML", stock: 55 },
        { name: "Whipped Cream", price: 90, compareAt: 115, unit: "200 GM", stock: 35 },
        { name: "Farm Eggs", price: 72, compareAt: 90, unit: "6 Pieces", stock: 120 },
        { name: "Free Range Eggs", price: 96, compareAt: 120, unit: "6 Pieces", stock: 80 },
        { name: "Organic Eggs", price: 120, compareAt: 150, unit: "6 Pieces", stock: 50 },
        { name: "Egg Whites Liquid", price: 110, compareAt: 140, unit: "500 ML", stock: 30 },
        { name: "Khoya / Mawa", price: 180, compareAt: 225, unit: "250 GM", stock: 25 },
        { name: "Condensed Milk", price: 80, compareAt: 100, unit: "400 GM", stock: 45 },
        { name: "Milk Powder", price: 220, compareAt: 275, unit: "1 KG", stock: 35 },
        { name: "Sour Cream", price: 95, compareAt: 120, unit: "200 GM", stock: 28 },
        { name: "Labneh / Strained Yogurt", price: 110, compareAt: 140, unit: "300 GM", stock: 22 },
        { name: "Feta Cheese", price: 190, compareAt: 240, unit: "200 GM", stock: 25 },
        { name: "Ricotta Cheese", price: 170, compareAt: 210, unit: "250 GM", stock: 22 },
        { name: "Parmesan Cheese", price: 280, compareAt: 350, unit: "150 GM", stock: 20 },
        { name: "Goat Cheese", price: 250, compareAt: 310, unit: "150 GM", stock: 18 },
        { name: "Mascarpone Cheese", price: 220, compareAt: 275, unit: "250 GM", stock: 18 },
        { name: "Flavored Yogurt Strawberry", price: 50, compareAt: 65, unit: "150 ML", stock: 50 },
        { name: "Flavored Yogurt Mango", price: 50, compareAt: 65, unit: "150 ML", stock: 50 },
        { name: "Flavored Yogurt Blueberry", price: 55, compareAt: 70, unit: "150 ML", stock: 45 },
        { name: "Lassi Sweet", price: 35, compareAt: 48, unit: "200 ML", stock: 60 },
        { name: "Lassi Salted", price: 35, compareAt: 48, unit: "200 ML", stock: 55 },
        { name: "Shrikhand", price: 90, compareAt: 115, unit: "200 GM", stock: 35 },
        { name: "Amul Butter", price: 50, compareAt: 65, unit: "100 GM", stock: 80 },
        { name: "Amul Cheese", price: 85, compareAt: 108, unit: "200 GM", stock: 75 },
        { name: "Amul Fresh Cream", price: 60, compareAt: 78, unit: "200 ML", stock: 60 },
        { name: "Dahi Set Curd", price: 45, compareAt: 58, unit: "500 GM", stock: 65 },
        { name: "Srikhand Amrakhand", price: 110, compareAt: 140, unit: "200 GM", stock: 25 },
        { name: "White Butter", price: 45, compareAt: 58, unit: "100 GM", stock: 55 },
        { name: "Goat Milk", price: 90, compareAt: 115, unit: "500 ML", stock: 25 },
        { name: "Almond Milk", price: 120, compareAt: 150, unit: "1 Ltr", stock: 35 },
        { name: "Soya Milk", price: 70, compareAt: 90, unit: "1 Ltr", stock: 40 },
        { name: "Oat Milk", price: 130, compareAt: 160, unit: "1 Ltr", stock: 30 },
        { name: "Coconut Milk", price: 60, compareAt: 78, unit: "400 ML", stock: 45 },
        { name: "Cottage Cheese", price: 100, compareAt: 128, unit: "200 GM", stock: 35 },
        { name: "Hung Curd", price: 70, compareAt: 90, unit: "250 GM", stock: 30 },
      ],
    },
    {
      name: "Bakery & Bread",
      slug: "bakery-bread",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      products: [
        { name: "White Sandwich Bread", price: 35, compareAt: 45, unit: "400 GM", stock: 80 },
        { name: "Brown Bread", price: 45, compareAt: 58, unit: "400 GM", stock: 70 },
        { name: "Multigrain Bread", price: 55, compareAt: 70, unit: "400 GM", stock: 55 },
        { name: "Whole Wheat Bread", price: 50, compareAt: 65, unit: "400 GM", stock: 65 },
        { name: "Garlic Bread", price: 75, compareAt: 95, unit: "1 Pack", stock: 40 },
        { name: "Croissants", price: 90, compareAt: 115, unit: "2 Pieces", stock: 35 },
        { name: "Brioche", price: 85, compareAt: 108, unit: "1 Pack", stock: 30 },
        { name: "Ciabatta", price: 65, compareAt: 82, unit: "1 Piece", stock: 28 },
        { name: "Baguette", price: 55, compareAt: 70, unit: "1 Piece", stock: 35 },
        { name: "Pita Bread", price: 40, compareAt: 52, unit: "6 Pieces", stock: 50 },
        { name: "Naan Plain", price: 30, compareAt: 40, unit: "4 Pieces", stock: 60 },
        { name: "Garlic Naan", price: 45, compareAt: 58, unit: "4 Pieces", stock: 45 },
        { name: "Roti / Chapati", price: 25, compareAt: 35, unit: "10 Pieces", stock: 80 },
        { name: "Paratha Plain", price: 35, compareAt: 48, unit: "5 Pieces", stock: 65 },
        { name: "Aloo Paratha", price: 50, compareAt: 65, unit: "5 Pieces", stock: 45 },
        { name: "Pav / Dinner Rolls", price: 20, compareAt: 28, unit: "6 Pieces", stock: 90 },
        { name: "Burger Buns", price: 35, compareAt: 45, unit: "4 Pieces", stock: 60 },
        { name: "Hot Dog Buns", price: 35, compareAt: 45, unit: "4 Pieces", stock: 50 },
        { name: "Bagels Plain", price: 60, compareAt: 78, unit: "4 Pieces", stock: 35 },
        { name: "Bagels Sesame", price: 65, compareAt: 82, unit: "4 Pieces", stock: 30 },
        { name: "Muffins Blueberry", price: 80, compareAt: 100, unit: "2 Pieces", stock: 35 },
        { name: "Muffins Chocolate", price: 80, compareAt: 100, unit: "2 Pieces", stock: 35 },
        { name: "Croissant Chocolate", price: 100, compareAt: 128, unit: "2 Pieces", stock: 25 },
        { name: "Cinnamon Rolls", price: 95, compareAt: 120, unit: "2 Pieces", stock: 28 },
        { name: "Donuts Glazed", price: 60, compareAt: 78, unit: "4 Pieces", stock: 40 },
        { name: "Donuts Chocolate", price: 70, compareAt: 88, unit: "4 Pieces", stock: 35 },
        { name: "Cookies Chocolate Chip", price: 65, compareAt: 82, unit: "6 Pieces", stock: 50 },
        { name: "Cookies Oatmeal", price: 55, compareAt: 70, unit: "6 Pieces", stock: 45 },
        { name: "Cookies Butter", price: 50, compareAt: 65, unit: "6 Pieces", stock: 55 },
        { name: "Brownies", price: 90, compareAt: 115, unit: "3 Pieces", stock: 35 },
        { name: "Banana Bread", price: 75, compareAt: 95, unit: "1 Loaf", stock: 30 },
        { name: "Pound Cake", price: 85, compareAt: 108, unit: "1 Loaf", stock: 25 },
        { name: "Fruit Cake", price: 120, compareAt: 150, unit: "1 Loaf", stock: 20 },
        { name: "English Muffins", price: 55, compareAt: 70, unit: "4 Pieces", stock: 35 },
        { name: "Crumpets", price: 60, compareAt: 78, unit: "4 Pieces", stock: 28 },
        { name: "Sourdough Bread", price: 80, compareAt: 100, unit: "1 Loaf", stock: 30 },
        { name: "Rye Bread", price: 70, compareAt: 90, unit: "1 Loaf", stock: 25 },
        { name: "Focaccia", price: 65, compareAt: 82, unit: "1 Piece", stock: 22 },
        { name: "Tortillas", price: 45, compareAt: 58, unit: "8 Pieces", stock: 45 },
        { name: "Wraps", price: 55, compareAt: 70, unit: "5 Pieces", stock: 40 },
        { name: "Khari / Puff Pastry", price: 30, compareAt: 40, unit: "5 Pieces", stock: 50 },
        { name: "Bread Sticks", price: 40, compareAt: 52, unit: "1 Pack", stock: 35 },
        { name: "Pretzels", price: 70, compareAt: 88, unit: "4 Pieces", stock: 25 },
        { name: "Rusk / Toast", price: 35, compareAt: 45, unit: "1 Pack", stock: 60 },
        { name: "Cake Rusk", price: 40, compareAt: 52, unit: "1 Pack", stock: 55 },
        { name: "Biscotti", price: 85, compareAt: 108, unit: "1 Pack", stock: 22 },
        { name: "Shortbread", price: 70, compareAt: 88, unit: "1 Pack", stock: 30 },
        { name: "Macarons", price: 180, compareAt: 225, unit: "6 Pieces", stock: 20 },
        { name: "Cupcakes Vanilla", price: 100, compareAt: 128, unit: "4 Pieces", stock: 25 },
        { name: "Cupcakes Chocolate", price: 110, compareAt: 140, unit: "4 Pieces", stock: 25 },
      ],
    },
    {
      name: "Herbs, Spices & Seasonings",
      slug: "herbs-spices",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
      products: [
        { name: "Turmeric Powder", price: 80, compareAt: 100, unit: "200 GM", stock: 70 },
        { name: "Red Chili Powder", price: 65, compareAt: 82, unit: "200 GM", stock: 80 },
        { name: "Coriander Powder", price: 55, compareAt: 70, unit: "200 GM", stock: 75 },
        { name: "Cumin Seeds / Jeera", price: 70, compareAt: 88, unit: "200 GM", stock: 65 },
        { name: "Mustard Seeds / Rai", price: 45, compareAt: 58, unit: "200 GM", stock: 60 },
        { name: "Fennel Seeds / Saunf", price: 50, compareAt: 65, unit: "200 GM", stock: 55 },
        { name: "Fenugreek Seeds / Methi", price: 40, compareAt: 52, unit: "200 GM", stock: 55 },
        { name: "Garam Masala", price: 90, compareAt: 115, unit: "100 GM", stock: 60 },
        { name: "Chaat Masala", price: 75, compareAt: 95, unit: "100 GM", stock: 50 },
        { name: "Sambar Powder", price: 85, compareAt: 108, unit: "200 GM", stock: 45 },
        { name: "Rasam Powder", price: 70, compareAt: 90, unit: "200 GM", stock: 40 },
        { name: "Black Pepper Powder", price: 120, compareAt: 150, unit: "100 GM", stock: 55 },
        { name: "Cardamom Green", price: 250, compareAt: 310, unit: "50 GM", stock: 40 },
        { name: "Cardamom Black", price: 200, compareAt: 250, unit: "50 GM", stock: 30 },
        { name: "Cloves / Laung", price: 180, compareAt: 225, unit: "100 GM", stock: 45 },
        { name: "Cinnamon Sticks", price: 100, compareAt: 128, unit: "100 GM", stock: 50 },
        { name: "Bay Leaves / Tej Patta", price: 35, compareAt: 48, unit: "50 GM", stock: 65 },
        { name: "Nutmeg / Jaiphal", price: 60, compareAt: 78, unit: "50 GM", stock: 35 },
        { name: "Mace / Javitri", price: 150, compareAt: 190, unit: "50 GM", stock: 25 },
        { name: "Star Anise / Chakra Phool", price: 120, compareAt: 150, unit: "50 GM", stock: 30 },
        { name: "Carom Seeds / Ajwain", price: 40, compareAt: 52, unit: "200 GM", stock: 50 },
        { name: "Dill Seeds / Sowa", price: 55, compareAt: 70, unit: "200 GM", stock: 35 },
        { name: "Poppy Seeds / Khus Khus", price: 90, compareAt: 115, unit: "200 GM", stock: 30 },
        { name: "Sesame Seeds / Til", price: 65, compareAt: 82, unit: "200 GM", stock: 55 },
        { name: "Dry Mango Powder / Amchur", price: 70, compareAt: 88, unit: "200 GM", stock: 40 },
        { name: "Asafoetida / Hing", price: 50, compareAt: 65, unit: "50 GM", stock: 60 },
        { name: "Tamarind Concentrate", price: 60, compareAt: 78, unit: "200 GM", stock: 45 },
        { name: "Coconut Powder", price: 80, compareAt: 100, unit: "200 GM", stock: 50 },
        { name: "Curry Powder", price: 75, compareAt: 95, unit: "200 GM", stock: 45 },
        { name: "Tandoori Masala", price: 85, compareAt: 108, unit: "200 GM", stock: 40 },
        { name: "Kitchen King Masala", price: 90, compareAt: 115, unit: "200 GM", stock: 38 },
        { name: "Pav Bhaji Masala", price: 80, compareAt: 100, unit: "200 GM", stock: 45 },
        { name: "Oregano Dried", price: 65, compareAt: 82, unit: "50 GM", stock: 40 },
        { name: "Basil Dried / Tulsi", price: 60, compareAt: 78, unit: "50 GM", stock: 35 },
        { name: "Thyme Dried", price: 70, compareAt: 88, unit: "50 GM", stock: 30 },
        { name: "Rosemary Dried", price: 80, compareAt: 100, unit: "50 GM", stock: 28 },
        { name: "Parsley Dried", price: 55, compareAt: 70, unit: "50 GM", stock: 32 },
        { name: "Mint Dried / Pudina", price: 50, compareAt: 65, unit: "50 GM", stock: 35 },
        { name: "Saffron / Kesar", price: 500, compareAt: 620, unit: "2 GM", stock: 20 },
        { name: "Vanilla Extract", price: 180, compareAt: 225, unit: "30 ML", stock: 30 },
        { name: "Rose Water", price: 60, compareAt: 78, unit: "100 ML", stock: 45 },
        { name: "Kewra Water", price: 55, compareAt: 70, unit: "100 ML", stock: 35 },
        { name: "Pomegranate Seeds Dried", price: 120, compareAt: 150, unit: "100 GM", stock: 25 },
        { name: "Caraway Seeds / Shah Jeera", price: 80, compareAt: 100, unit: "100 GM", stock: 30 },
        { name: "Celery Salt", price: 55, compareAt: 70, unit: "100 GM", stock: 28 },
        { name: "Garlic Powder", price: 65, compareAt: 82, unit: "100 GM", stock: 40 },
        { name: "Onion Powder", price: 60, compareAt: 78, unit: "100 GM", stock: 38 },
        { name: "Chili Flakes", price: 50, compareAt: 65, unit: "100 GM", stock: 50 },
        { name: "Mixed Herbs", price: 70, compareAt: 88, unit: "50 GM", stock: 35 },
        { name: "Italian Seasoning", price: 75, compareAt: 95, unit: "50 GM", stock: 30 },
      ],
    },
  ];

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@grocery.com",
      passwordHash: "$2a$12$dummyhashfordevpurposesonly",
      role: "ADMIN",
      phone: "9876543210",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create a demo user
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@demo.com",
      passwordHash: "$2a$12$dummyhashfordevpurposesonly",
      role: "USER",
      phone: "9876543211",
    },
  });
  console.log(`Created demo user: ${demoUser.email}`);

  // Create categories and products
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
      },
    });

    for (const prod of cat.products) {
      const slug = prod.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      await prisma.product.create({
        data: {
          name: prod.name,
          slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
          price: prod.price,
          compareAt: prod.compareAt,
          unit: prod.unit,
          stock: prod.stock,
          categoryId: category.id,
          isAvailable: true,
          isFeatured: Math.random() > 0.7,
          images: [
            `https://images.unsplash.com/photo-${Math.floor(Math.random() * 900000000) + 100000000}?w=400&h=400&fit=crop`,
          ],
          description: `Fresh and high-quality ${prod.name.toLowerCase()} sourced directly from local farms. Perfect for your daily cooking needs.`,
        },
      });
    }

    console.log(`Created category "${cat.name}" with ${cat.products.length} products`);
  }

  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  console.log(`\nSeeding complete!`);
  console.log(`  Categories: ${categoryCount}`);
  console.log(`  Products: ${productCount}`);
  console.log(`  Users: 2 (admin + demo)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
