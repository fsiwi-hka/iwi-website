function Groups({groups}) {
    const renderedGroups = renderGroups(groups)
    return (
        <div className="groups grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 mb-16">
            { renderedGroups }
        </div>
    )
}

function renderGroups(groups) {
    return groups.map((group) => {
        const groupImage = group.image
            ? <img src={ group.image }
                   alt={group.title}
                   className="object-cover rounded-lg"
                   style={{ width: '228px', height: '228px' }} />
            : null
        return (
            <div key={group.title}>
                { groupImage }
                
                <ul className="mt-2 mb-0 mx-0 list-none">
                    {
                        group.people.map((person) => {
                        return <li className="font-medium my-0" key={person}>{ person }</li>
                        })
                    }
                </ul>

                <p className="text-sm my-0">{ group.title }</p>
            </div>
        )
    })
}

export default Groups