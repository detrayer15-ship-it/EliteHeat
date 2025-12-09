getAll: async () => {
    try {
        const assignmentsSnapshot = await getDocs(
            query(collection(db, 'assignments'), orderBy('createdAt', 'desc'))
        )

        const assignments = assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return {
            success: true,
            data: assignments
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
},

    // Submit assignment
    submitAssignment: async (
        assignmentId: string,
        studentId: string,
        studentName: string,
        content: string,
        fileUrl?: string
    ) => {
        try {
            const submissionRef = await addDoc(collection(db, 'submissions'), {
                assignmentId,
                studentId,
                studentName,
                content,
                fileUrl: fileUrl || null,
                status: 'pending',
                submittedAt: Timestamp.now()
            })

            return {
                success: true,
                data: { id: submissionRef.id }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

        // Get student submissions
        getMySubmissions: async (studentId: string) => {
            try {
                const submissionsSnapshot = await getDocs(
                    query(
                        collection(db, 'submissions'),
                        where('studentId', '==', studentId),
                        orderBy('submittedAt', 'desc')
                    )
                )

                const submissions = submissionsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                return {
                    success: true,
                    data: submissions
                }
            } catch (error: any) {
                return {
                    success: false,
                    message: error.message
                }
            }
        },

            // Get all submissions (admin)
            getAllSubmissions: async () => {
                try {
                    const submissionsSnapshot = await getDocs(
                        query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'))
                    )

                    const submissions = await Promise.all(
                        submissionsSnapshot.docs.map(async (docSnapshot) => {
                            const data = docSnapshot.data()

                            // Get assignment info
                            const assignmentDoc = await getDoc(doc(db, 'assignments', data.assignmentId))
                            const assignmentData = assignmentDoc.data()

                            return {
                                id: docSnapshot.id,
                                ...data,
                                assignmentTitle: assignmentData?.title || 'Неизвестное задание'
                            }
                        })
                    )

                    return {
                        success: true,
                        data: submissions
                    }
                } catch (error: any) {
                    return {
                        success: false,
                        message: error.message
                    }
                }
            },

                // Review submission
                reviewSubmission: async (
                    submissionId: string,
                    adminId: string,
                    status: 'approved' | 'rejected',
                    comment: string
                ) => {
                    try {
                        const submissionRef = doc(db, 'submissions', submissionId)

                        await updateDoc(submissionRef, {
                            status,
                            reviewedBy: adminId,
                            reviewComment: comment,
                            reviewedAt: Timestamp.now()
                        })

                        // Add points to admin
                        const userRef = doc(db, 'users', adminId)
                        const userDoc = await getDoc(userRef)

                        if (userDoc.exists()) {
                            const currentPoints = userDoc.data().points || 0
                            const tasksReviewed = (userDoc.data().tasksReviewed || 0) + 1
                            const newPoints = currentPoints + 10

                            // Calculate level
                            let level = 1
                            if (newPoints >= 1000) level = 5
                            else if (newPoints >= 600) level = 4
                            else if (newPoints >= 300) level = 3
                            else if (newPoints >= 100) level = 2

                            await updateDoc(userRef, {
                                points: newPoints,
                                level,
                                tasksReviewed
                            })
                        }

                        return {
                            success: true
                        }
                    } catch (error: any) {
                        return {
                            success: false,
                            message: error.message
                        }
                    }
                }
}
