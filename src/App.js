// https://github.com/bradtraversy/react-crash-2021/blob/master/src/App.js

import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'

// The mother Application that sends down info to children
function App() {
  // Toggle the add tasks list
  const [showAddList, setShowAddList] = useState(false)

  // A store that all children can access
  const [tasks, setTasks] = useState([])

  // A function that loads the data on initial reload
  useEffect(() => {
    const getTasks = async() =>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // A function that returns ALL TASKS from the backend 
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // A function that returns ONE TASK from the backend 
  const fetchTask = async(id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // A function to ADD a task
  const addTask = async(task) => {
    const res = await fetch(`http://localhost:5000/tasks`, 
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      })

      const data = await res.json()

    // // Create a random ID
    // const id = Math.floor(Math.random() *10000)+1
    // // Create a new task - the id and the task details
    // const newTask = {id, ...task}
    // Add the new task to the State
    setTasks([...tasks, data])
  }


  // A function to DELETE a task
  const deleteTask = async(id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    // When deleted, only show the remaining tasks available
    // This function affects the state
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // A Function to Toggle The Reminder Boolean Value
  const toggleReminder = async (id) => {
    // console.log('reminder', id)
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    // Change state, map the task, copy all the task values, change the reminder value
    setTasks(
      tasks.map(
        (task) => task.id === id ?
          {...task, reminder: data.reminder} : task
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header 
          onAdd={() => setShowAddList(!showAddList)}
          showAdd={showAddList} />

        <Route path='/' exact render={
          (props) => (
            <>              
              {showAddList && <AddTask onAdd={addTask} />}

              {/* If there are no tasks, display a message */}
              {tasks.length > 0 ? 
                <Tasks tasks={tasks} 
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                  />
                : 'No Tasks Available'}
            </>
          )
        }/>

        <Route path='/about' component={About} />
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
