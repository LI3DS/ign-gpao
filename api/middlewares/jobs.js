const Pool = require('pg').Pool
const pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
})

const { matchedData } = require('express-validator/filter');


function getAllJobs(req, res){
	pool.query("SELECT * FROM jobs", (error, results) => {

	if (error) {
		throw error
	}

	res.status(200).json(results.rows)
	})
}

function getJobReady(req, res){
	pool.query("UPDATE jobs SET status = 'running' WHERE id = (SELECT id FROM jobs WHERE status = 'ready' LIMIT 1) RETURNING id, command", (error, results) => {

	if (error){
		throw error
	}
	res.status(200).json(results.rows)
	})
}

function updateJobStatus(req, res){
	var params = matchedData(req);

    const id = req.params.id
	const status = req.params.status
	const log = req.body.log
	
    pool.query(
      'UPDATE jobs SET status = $1, log = $2 WHERE id = $3',
      [status, log, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`Job updated`)
      }
    )
}
module.exports = {
	getAllJobs,
	getJobReady,
	updateJobStatus
}