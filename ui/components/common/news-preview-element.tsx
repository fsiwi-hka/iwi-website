function NewsPreviewElement({ title, content }) {
    return (
        <div className="w-full white_bg rounded-md p-6 shadow-sm">
            <h4 className="petrol_text font-bold mb-3">{title}</h4>
            <div
                className="news-content text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}

export default NewsPreviewElement;