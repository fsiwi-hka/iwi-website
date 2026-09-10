import DOMPurify from "isomorphic-dompurify";

interface NewsPreviewElementProps {
    title: string;
    /** HTML aus dem Bulletin Board - wird vor dem Rendern bereinigt. */
    content: string;
}

function NewsPreviewElement({ title, content }: NewsPreviewElementProps) {
    return (
        <div className="w-full white_bg rounded-md p-6 shadow-sm">
            <h4 className="petrol_text font-bold mb-3">{title}</h4>
            <div
                className="news-content text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content ?? "") }}
            />
        </div>
    );
}

export default NewsPreviewElement;
