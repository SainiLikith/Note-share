

export default function config (io){
    io.on ('connection', (socket) => {
      console.log('New client connected:' , socket.id);

      
      socket.on('joinNote',(noteId) => {
        socket.join(noteId);
        console.log(`Client ${socket.id} joined room ${noteId}`);
      });
      
        socket.on('editNote', (noteId, data) => {
         
            socket.to(noteId).emit('noteUpdated', data);
            console.log(`Note ${noteId} edited by client ${socket.id}`);
        });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        });
    })
        
}