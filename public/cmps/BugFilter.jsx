
import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt, minSeverity, date } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">title</label>
                <input value={txt} onChange={handleChange} name="txt" type="text" id="txt" />

                <label htmlFor="minSeverity">Min Severity</label>
                <input value={minSeverity || ''} onChange={handleChange} name="minSeverity" type="number" id="minSeverity" />

                <label htmlFor="date">Date</label>
                <input value={date || ''} onChange={handleChange} name="date" type="date" id="date" />

                <button>Submit</button>
            </form>
        </section>
    )
}