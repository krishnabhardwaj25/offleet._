const EventEmitter = require('events');
const { db } = require('./schema');

class SyncService extends EventEmitter {
    constructor() {
        super();
        this.interval = null;
    }

    start() {
        this.syncNow();
        this.interval = setInterval(() => {
            this.syncNow();
        }, 60000);
    }

    stop() {
        if (this.interval) clearInterval(this.interval);
    }

    async syncNow() {
        const unsynced = db.prepare(`
            SELECT * FROM submissions 
            WHERE synced_at IS NULL 
            AND (sync_attempts IS NULL OR sync_attempts < 5)
        `).all();

        for (const submission of unsynced) {
            await this.syncSubmission(submission);
        }
    }

    async syncSubmission(submission) {
        try {
            const response = await fetch('http://localhost:3000/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    local_id: submission.local_id,
                    problem_id: submission.problem_id,
                    code: submission.code,
                    verdict: submission.verdict,
                    created_at: submission.created_at
                })
            });

            if (response.ok) {
                db.prepare('UPDATE submissions SET synced_at = ? WHERE local_id = ?')
                  .run(new Date().toISOString(), submission.local_id);
                console.log('synced submission:', submission.local_id);
            } else {
                this.incrementAttempts(submission.local_id);
            }
        } catch (err) {
            this.incrementAttempts(submission.local_id);
            console.error('sync failed:', err.message);
        }
    }

    incrementAttempts(local_id) {
        db.prepare('UPDATE submissions SET sync_attempts = sync_attempts + 1 WHERE local_id = ?')
          .run(local_id);
    }
}

module.exports = new SyncService();