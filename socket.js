let app = require('express')();

let http = require('http').Server(app);

let io = require('socket.io')(http);




/**
 * 
 * router.post('/:id/failure', function(req, res) {
  var goal_id = req.params.id
  Goal.addFailure(goal_id, function(err, goal) {
    if (err) {res.send(err)}
    res.sendStatus(200);
  })
})

// POST a new success for a goal
// (accessed at POST http://localhost:8080/goals/goal_id/success)
router.post('/:id/success', function(req, res) {
  var goal_id = req.params.id
  Goal.addSuccess(goal_id, function(err, goal) {
    if (err) {res.send(err)}
    res.sendStatus(200);
  })
})

// DELETE a goal
// (accessed at DELETE http://localhost:8080/goals/goal_id)
router.delete('/:id', function(req, res) {
  var goal_id = req.params.id
  Goal.delete(goal_id, function(err, goal) {
    if (err) {res.send(err)}
    res.sendStatus(200);
  })
})
 * 
 */

io.on('connect', (socket) => {

    console.log("connected")
    socket.on('disconnect', () => {
        console.log('disconnected')
    })

    socket.on('refresh_bus', (data) => {
        console.log(data)
        socket.broadcast.emit('refresh_bus', data)
    })
})

http.listen(8000, () => {
    console.log('Server is started at port 8000')
})