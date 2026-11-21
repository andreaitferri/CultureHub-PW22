export function ErrorState({ message }: { message: string }) {
  return <div className="card" style={{ borderColor: '#f0b4b4', color: '#8a1f1f' }}>{message}</div>;
}

