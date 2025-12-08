// Simple in-memory storage (temporary solution until MongoDB is set up)
const users = []
const messages = []
const conversations = []
const submissions = [] // NEW: For task submissions
const chats = [] // NEW: For student-admin chats

export const db = {
    users: {
        find: (query = {}) => {
            if (Object.keys(query).length === 0) return users
            return users.filter(user => {
                return Object.keys(query).every(key => user[key] === query[key])
            })
        },
        findOne: (query) => {
            if (!query || Object.keys(query).length === 0) return users[0]
            return users.find(user => {
                return Object.keys(query).every(key => {
                    if (key === 'email') {
                        return user[key]?.toLowerCase() === query[key]?.toLowerCase()
                    }
                    return user[key] === query[key]
                })
            })
        },
        findById: (id) => {
            return users.find(user => user._id === id)
        },
        create: (data) => {
            const newUser = {
                _id: Date.now().toString(),
                ...data,
                level: data.role === 'admin' ? 1 : undefined, // NEW: Admin level
                points: data.role === 'admin' ? 0 : undefined, // NEW: Admin points
                tasksReviewed: data.role === 'admin' ? 0 : undefined, // NEW: Tasks reviewed count
                createdAt: new Date(),
                updatedAt: new Date()
            }
            users.push(newUser)
            return newUser
        },
        updateOne: (query, update) => {
            const user = users.find(u => {
                return Object.keys(query).every(key => u[key] === query[key])
            })
            if (user) {
                Object.assign(user, update.$set || update)
                user.updatedAt = new Date()
            }
            return user
        },
        deleteOne: (query) => {
            const index = users.findIndex(u => {
                return Object.keys(query).every(key => u[key] === query[key])
            })
            if (index > -1) {
                users.splice(index, 1)
                return true
            }
            return false
        }
    },

    // NEW: Submissions collection
    submissions: {
        find: (query = {}) => {
            if (Object.keys(query).length === 0) return submissions
            return submissions.filter(sub => {
                return Object.keys(query).every(key => sub[key] === query[key])
            })
        },
        findById: (id) => {
            return submissions.find(sub => sub._id === id)
        },
        create: (data) => {
            const newSubmission = {
                _id: Date.now().toString(),
                ...data,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            submissions.push(newSubmission)
            return newSubmission
        },
        updateOne: (query, update) => {
            const submission = submissions.find(s => {
                return Object.keys(query).every(key => s[key] === query[key])
            })
            if (submission) {
                Object.assign(submission, update.$set || update)
                submission.updatedAt = new Date()
            }
            return submission
        }
    },

    // NEW: Chats collection
    chats: {
        find: (query = {}) => {
            if (Object.keys(query).length === 0) return chats
            return chats.filter(chat => {
                return Object.keys(query).every(key => chat[key] === query[key])
            })
        },
        findOne: (query) => {
            return chats.find(chat => {
                return Object.keys(query).every(key => chat[key] === query[key])
            })
        },
        findById: (id) => {
            return chats.find(chat => chat._id === id)
        },
        create: (data) => {
            const newChat = {
                _id: Date.now().toString(),
                ...data,
                messages: data.messages || [],
                unreadCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            chats.push(newChat)
            return newChat
        },
        updateOne: (query, update) => {
            const chat = chats.find(c => {
                return Object.keys(query).every(key => c[key] === query[key])
            })
            if (chat) {
                Object.assign(chat, update.$set || update)
                chat.updatedAt = new Date()
            }
            return chat
        }
    },

    messages: {
        find: (query = {}) => {
            let results = messages
            if (query.$or) {
                results = messages.filter(msg => {
                    return query.$or.some(condition => {
                        return Object.keys(condition).every(key => msg[key] === condition[key])
                    })
                })
            }
            return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        },
        create: (data) => {
            const newMessage = {
                _id: Date.now().toString(),
                ...data,
                createdAt: new Date()
            }
            messages.push(newMessage)
            return newMessage
        }
    },
    conversations: {
        find: (query = {}) => {
            return conversations.filter(conv => {
                if (query.participants) {
                    return conv.participants.includes(query.participants)
                }
                return true
            })
        },
        findOne: (query) => {
            if (query.participants && query.participants.$all) {
                return conversations.find(conv => {
                    return query.participants.$all.every(p => conv.participants.includes(p))
                })
            }
            return conversations[0]
        },
        create: (data) => {
            const newConv = {
                _id: Date.now().toString(),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            conversations.push(newConv)
            return newConv
        }
    }
}
