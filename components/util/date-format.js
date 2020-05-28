function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today  = new Date(date);
    return today.toLocaleDateString("de-DE", options);
}

export default formatDate