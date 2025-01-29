import { useEmailStore } from '../stores/emailStore';

export function EmailList() {
  const { emails, viewMode, selected, toggleSelection } = useEmailStore();
  const { loadEmails } = useEmailStore();

  useEffect(() => {
    loadEmails();
  }, []);

  return (
    <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : ''}`}>
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={selected.includes(email.id)}
          onSelect={toggleSelection}
        />
      ))}
    </div>
  );
}
