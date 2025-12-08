import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eliteheat'

        await mongoose.connect(mongoURI)

        console.log('✅ MongoDB подключена успешно!')
        console.log(`📊 База данных: ${mongoose.connection.name}`)
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error.message)
        console.log('⚠️  Проверьте:')
        console.log('   1. MongoDB запущена локально')
        console.log('   2. Или настройте MONGODB_URI в .env')
        console.log('   3. Для MongoDB Atlas: https://www.mongodb.com/cloud/atlas')
        process.exit(1)
    }
}

export default connectDB
