import { FormControl, Modal, Row, Col, Stack, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag, Note } from "../../App";
import { useMemo, useState } from "react";
import NoteCard from "./NoteCard";
import EditTagsModal from "../EditTagsModal";

type NoteListProps = {
    availableTags: Tag[],
    notes: Note[],
    onDeleteTag: (id: string) => void,
    onUpdateTag: (id: string, label: string) => void
}


function NoteList({ availableTags, notes, onDeleteTag, onUpdateTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState("")
    const [editTagsModalOpen, setEditTagsModalOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                title === "" || note.title.toLowerCase().includes(title.toLowerCase())
            ) &&
                (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id))
                )
        })
    }, [title, selectedTags, notes])

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button onClick={() => setEditTagsModalOpen(true)} variant="outline-secondary">Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect required isMulti
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }} />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                )
                )}
            </Row>
            <EditTagsModal availableTags={availableTags} show={editTagsModalOpen} handleClose={() => setEditTagsModalOpen(false)} onDeleteTag={onDeleteTag} onUpdateTag={onUpdateTag} />
        </>
    )

}



export default NoteList;

