function Groups({groups}) {
    const renderedGroups = renderGroups(groups)
    return (
        <div className="groups grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            { renderedGroups }
        </div>
    )
}

function renderGroups(groups) {
    return groups.map((group) => {
        const groupImage = group.image
            ? <img src={ group.image }
                   alt={group.title}
                   className="object-cover"
                   style={{ width: '320px', height: '320px' }} />
            : null
        return (
            <div key={group.title}>
                { groupImage }
                <h4>{ group.title }</h4>
                <ul className="my-1 list-none">
                    {
                        group.people.map((person) => {
                        return <li className="leading-4" key={person}>{ person }</li>
                        })
                    }
                </ul>
            </div>
        )
    })
}

export default Groups