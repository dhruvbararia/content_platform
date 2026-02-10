import { useDocuments, useCreateDocument } from '../hooks/useDocuments';
import { useState } from 'react';

export default function DocumentsPage() {
  const [filters, setFilters] = useState({});
  const { data: documents, isLoading } = useDocuments(filters);
  const createMutation = useCreateDocument();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.split('.')[0]);
    formData.append('type', file.type.split('/')[1]);

    createMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <input type="file" onChange={handleUpload} accept="image/*,application/pdf" />
      
      <div>
        <input placeholder="Search..." onChange={(e) => setFilters({ q: e.target.value })} />
        {/* Filters: topic, category */}
      </div>

      <ul>
        {documents?.map(doc => (
          <li key={doc.id}>
            {doc.title} - <a href={doc.fileUrl || doc.fileKey}>Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
