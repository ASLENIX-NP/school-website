import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NoticeDetail() {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/notices/${id}`)
      .then((res) => res.json())
      .then((data) => setNotice(data));
  }, [id]);

  if (!notice) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-32 px-6">
      <h1 className="text-5xl font-bold mb-4">
        {notice.title}
      </h1>

      <p className="text-gray-500 mb-6">
        {notice.date}
      </p>

      <p>{notice.description}</p>
    </div>
  );
}