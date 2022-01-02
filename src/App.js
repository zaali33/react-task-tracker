import Header from './components/Header'
import Footer from './components/Footer'
import './index.css'
import { useState, useEffect } from 'react'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

	const [tasks, setTasks] = useState([])

	useEffect(() => {
		const getTasks = async () => {
			const tasksFromServer = await fetchTasks()
			setTasks(tasksFromServer)
		}

		getTasks()
	}, [])

	//Fetch Tasks
	const fetchTasks = async () => {
		const res = await fetch('http://localhost:5000/tasks')
		const data = await res.json()
		return data
	}

	//Fetch Task
	const fetchTask = async (id) => {
		const res = await fetch(`http://localhost:5000/tasks/${id}`)
		const data = await res.json()
		return data
	}

	//Delete Tasks
	const onDelete = async (id) => {
		await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
		setTasks(tasks.filter(task => task.id !== id))
	}

	const toggleReminder = async (id) => {
		const taskToToggle = await fetchTask(id)
		const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

		const res = await fetch(`http://localhost:5000/tasks/${id}`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(updTask)
		})

		const data = await res.json()

		setTasks(tasks.map(task => task.id === id ? { ...task, reminder: data.reminder } : task))
	}

	const addTask = async (task) => {
		const res = await fetch('http://localhost:5000/tasks',
			{ method: "POST", headers: { 'Content-type': 'application/json' }, body: JSON.stringify(task) }
		)
		const data = await res.json()
		setTasks([...tasks, data])
	}

	const [showAddTask, setShowAddTask] = useState(false)

	return (
		<Router>
			<div className="container">
				<Header onAddShow={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
				<Routes>
					<Route 
						path='/' 
						exact 
						element = {
							<>
								{showAddTask && <AddTask onAdd={addTask} />}
								{tasks.length !== 0 ?
									<Tasks tasks={tasks} onDelete={onDelete} onToggle={toggleReminder} />
									:
									"No Tasks to show"
								}
							</>
						} 
					/>
				</Routes>
				<Routes>
					<Route path='/about' element={<About />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	)
}

export default App;
