import {useState} from 'react'

const AddTask = ({ onAdd }) => {
    const [text, setText] = useState('')
    const [date, setDate] = useState('')
    const [reminder, setReminder] = useState(false)

    const onSubmit = (e) => {
        // Prevent the form from refreshing the page
        e.preventDefault()

        // Perform form validation for the task field
        if(!text){
            alert('Please add a task')
        }

        // If there is valid data, pass data to function
        onAdd({text, date, reminder})

        // Clear the form
        setText('')
        setDate('')
        setReminder(false)
    }

    return (
        <form className='form-control' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Task</label>
                <input type='text' placeholder='Add Task'
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                />
            </div>
            <div className='form-control'>
                <label>Date & Time</label>
                <input type='text' placeholder='Add Date & Time'
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}/>
            </div>
            <div className='form-control-check'>
                <label>Set Reminder</label>
                <input type='checkbox'
                    checked={reminder}
                    value={reminder}
                    onChange={(e)=>setReminder(e.target.checked)}/>
            </div>

            <input type='submit' name='Save Task' className='btn btn-block' />
        </form>
    )
}

export default AddTask
