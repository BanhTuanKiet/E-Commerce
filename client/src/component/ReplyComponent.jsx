import { Reply } from 'lucide-react'
import React from 'react'
import { Button, Form } from 'react-bootstrap'

export default function ReplyComponent({ replyContent, setReplyContent, handleReply }) {
  return (
    <div>
      <Form.Label htmlFor="reply">Thêm phản hồi mới</Form.Label>
      <Form.Control
        as="textarea"
        id="reply"
        rows={4}
        placeholder="Write something..."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        className="mb-3"
      />
      <Button variant="primary" onClick={handleReply}>
        <Reply size={16} className="me-2" />
        Reply
      </Button>
    </div>
  )
}
