import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import { socket } from './socket';
import { HomePage } from './components/Home';
import { WritingBoard } from './components/WritingBoard';
import { DrawingBoard } from './components/DrawingBoard';

function App() {
	useEffect(() => {
		socket.on('connect', () =>
			console.log(`You connected to socket successfully. Your id is ${socket.id}.`)
		);
	}, []);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/write" element={<WritingBoard />} />
				<Route path="/draw" element={<DrawingBoard />} />
			</Routes>
		</div>
	);
};

export default App;
