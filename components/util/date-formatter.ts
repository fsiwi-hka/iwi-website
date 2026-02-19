function DateFormatter() {

}

DateFormatter.formatDate = (date) => {
    const options: {
        year: "numeric";
        month: "long";
        day: "numeric";
    } = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const today = new Date(date)
    return today.toLocaleDateString("de-DE", options);
}

DateFormatter.formatDateTime = (date) => {
    const options: {
        year: "numeric";
        month: "long";
        day: "numeric";
        hour: "2-digit";
        minute: "2-digit"
    } = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
    const today = new Date(date);
    return today.toLocaleString("de-DE", options);
}

export default DateFormatter