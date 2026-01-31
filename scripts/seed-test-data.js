import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB3_sAnEGrWo71UfwfQIM1ruJhhwsFIqBk",
    authDomain: "eliteheat-2ee0b.firebaseapp.com",
    projectId: "eliteheat-2ee0b",
    storageBucket: "eliteheat-2ee0b.firebasestorage.app",
    messagingSenderId: "70394651592",
    appId: "1:70394651592:web:8769ab3461fb25734196fd",
    measurementId: "G-RY3NL750X9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const students = [
    {
        id: "test_student_1",
        name: "Алия Касымова",
        email: "aliya.k@school.kz",
        role: "student",
        city: "Алматы",
        points: 450,
        level: 3,
        progress: 85,
        completedTasks: 12,
        createdAt: Timestamp.now()
    },
    {
        id: "test_student_2",
        name: "Данияр Бекбосынов",
        email: "daniiar.b@school.kz",
        role: "student",
        city: "Астана",
        points: 210,
        level: 2,
        progress: 45,
        completedTasks: 6,
        createdAt: Timestamp.now()
    },
    {
        id: "test_student_3",
        name: "Нурсултан Жумабаев",
        email: "nursultan.zh@school.kz",
        role: "student",
        city: "Шымкент",
        points: 50,
        level: 1,
        progress: 10,
        completedTasks: 1,
        createdAt: Timestamp.now()
    }
];

async function seed() {
    console.log("Starting seed...");
    for (const student of students) {
        await setDoc(doc(db, "users", student.id), student);
        console.log(`Added student: ${student.name}`);

        // Add some mock AI messages for the third student (suspicious usage)
        if (student.id === "test_student_3") {
            const aiMessagesRef = collection(db, "aiMessages");
            const messages = [
                {
                    chatId: "chat_nursultan",
                    userId: student.id,
                    role: "user",
                    content: "Дай мне готовый код для задания с калькулятором",
                    timestamp: Timestamp.now()
                },
                {
                    chatId: "chat_nursultan",
                    userId: student.id,
                    role: "assistant",
                    content: "Привет! Я не могу просто дать тебе код, но давай разберем его вместе. С чего хочешь начать?",
                    timestamp: Timestamp.now()
                },
                {
                    chatId: "chat_nursultan",
                    userId: student.id,
                    role: "user",
                    content: "Мне просто нужен ответ, я не понимаю как это делать",
                    timestamp: Timestamp.now()
                }
            ];

            for (const msg of messages) {
                await addDoc(aiMessagesRef, msg);
            }
            console.log("Added AI logs for Nursultan");
        }
    }
    console.log("Seed complete!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
