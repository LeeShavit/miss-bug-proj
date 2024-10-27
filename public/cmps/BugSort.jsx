
import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugSort({ sortBy, onSetSort }) {

    const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })
    const onSetSortDebounce = useRef(utilService.debounce(onSetSort, 100))

    useEffect(() => {
        onSetSortDebounce.current(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        setSortByToEdit(prevSort => ({ ...prevSort, [field]: value }))
        onSetSort(sortByToEdit)
    }

    function onChangeDir() {
        const newDir = sortByToEdit.dir ? -sortByToEdit.dir : 1
        setSortByToEdit(prevSort => ({ ...prevSort, dir: newDir }))
        onSetSort(sortByToEdit)
    }

return (
    <section className="bug-Sort">
        <label htmlFor="sort-by">Sort by:</label>
        <select name="key" id="sort-by" onChange={handleChange}>
            <option value="title">Title</option>
            <option value="severity">Severity</option>
            <option value="createdAt">Creation</option>
        </select>
        <button onClick={onChangeDir}>⬆︎⬇</button>
    </section>
)
}
