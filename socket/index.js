const io = require("socket.io")(8000, {
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	// each user join his room
	const userId = socket.handshake.query.id;
	socket.join(userId);

	socket.on("join-chat", (conversationId) => {
		socket.join(conversationId);
		socket.on("leave-room", () => socket.leave(conversationId));
		socket.on("send-message", (message) => {
			socket.to(conversationId).emit("recive-message", message);
		});
	});

	socket.on("disconnect", () => {
		socket.emit("message", { text: `user: ${socket.id} disconnected` });
	});

	socket.on("invite-to-conversation", (usersIds) => {
		socket.to(usersIds.reciverId).emit("recive-invite", {
			from: usersIds.senderid,
			name: usersIds.senderName,
		});
	});

	socket.on("accepte-invite", ({ conversation, member }) => {
		socket.to(member).emit("new-conversation-created", conversation);
	});
});
