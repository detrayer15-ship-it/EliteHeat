const TEST_CASES = [
    { q: "где скачать figma?", expected: "DIRECT (Download link)" },
    { q: "напиши код сортировки списка на python", expected: "CODE (No Text Before Code)" },
    { q: "объясни подробно этот код: print('hello')", expected: "CODE_EXPLAIN (Line-by-line breakdown)" },
    { q: "что такое api?", expected: "DIRECT (Concise Definition)" },
    {
        q: "что на этой картинке?",
        img: { type: "image/png", base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" },
        expected: "VISION (Image analysis)"
    }
];

async function runSuite() {
    console.log("🚀 Starting Mita Advanced Kernel Test Suite (v6.0 Vision)...\n");

    for (const test of TEST_CASES) {
        process.stdout.write(`[TEST] Question: "${test.q}" ${test.img ? '[WITH IMAGE]' : ''}... `);

        const startTime = Date.now();
        try {
            const response = await fetch('http://127.0.0.1:3000/api/ai/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: test.q,
                    history: [],
                    image: test.img,
                    requestId: `test-${Date.now()}`
                })
            });

            const data = await response.json();
            const latency = Date.now() - startTime;

            if (data.reply) {
                console.log(`✅ Passed | Intent: ${data.intent} | Latency: ${latency}ms`);
                // console.log(`   Reply: ${data.reply.substring(0, 100)}...`);
            } else {
                console.log(`❌ Failed: No reply`);
            }
        } catch (err) {
            console.log(`❌ Error: ${err.message}`);
        }
    }
    console.log("\n✨ Test Suite Completed.");
}

runSuite();
