function Groups({ groups }) {
  const renderedGroups = renderGroups(groups);
  return (
    <div className="groups grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 my-8">
      {renderedGroups}
    </div>
  );
}

function renderGroups(groups) {
  return groups.map((group) => {
    const groupImage = group.image ? (
      <img
        src={group.image}
        alt={group.title}
        className="object-cover"
        style={{ width: "250px", height: "250px" }}
      />
    ) : null;
    return (
      <div className="flex flex-col items-center" key={group.title}>
        {groupImage}
        <h4 className="font-semibold">{group.person}</h4>
        <p className="text-sm text-gray-700">{group.title}</p>
      </div>
    );
  });
}

export default Groups;
