import {MongoClient} from "mongodb"

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
async function main() {

  try {
    await client.connect()
    const db = client.db("test")
    const collection = db.collection("test")
    const data=[{
      name:"adithya",age:20
    },{
      name:"nagresh",age:22
    }]
    const result = await collection.insertMany(data)
    console.log(result)
    console.log("Inserted document:", result)
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  
  }}

  main().catch(console.error)