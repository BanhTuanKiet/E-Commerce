export default function BoxChat({ view, content }) {
  return (
    <>
      {content?.map((reply, idx) => {
        const isOwnMessage = (view === "customer" && reply.role === "customer") || (view === "admin" && reply.role === "admin")

        return (
          <div key={idx} className={`p-3 bg-primary bg-opacity-10 rounded mb-3 w-75 ${isOwnMessage ? "ms-auto text-end" : ""}`}>
            <div className={`d-flex align-items-center gap-2 mb-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
              <span className="fw-medium">{reply.role}</span>
              <span className="small text-muted">
                {new Date(reply.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
            <p className="text-dark mb-0">{reply.content}</p>
          </div>
        )
      })}
    </>
  )
}
