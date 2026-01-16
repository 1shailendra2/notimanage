import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export default function GroupPage() {
    const { groupId } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [children, setChildren] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);


    const [showPostForm, setShowPostForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [groupRes, childrenRes, newsRes] = await Promise.all([
                    api.get(`/groups/${groupId}`),
                    api.get(`/groups/${groupId}/children`),
                    api.get(`/news/group/${groupId}`)
                ]);
                setGroup(groupRes.data.group);
                setChildren(childrenRes.data.children);
                setNewsList(newsRes.data.news);

                if (user) {
                    const roleRes = await api.get(`/groups/${groupId}/role`);
                    setRole(roleRes.data.role);
                }
            } catch (error) {
                console.error("Failed to load group data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [groupId, user]);

    const handlePostNews = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/news', {
                groupId,
                title,
                content
            });
            setNewsList([res.data.news, ...newsList]);
            setShowPostForm(false);
            setTitle('');
            setContent('');
        } catch (error) {
            alert("Failed to post news");
        }
    };

    const handleJoin = async (roleToJoin) => {
        try {
            const res = await api.post(`/groups/${groupId}/join`, { role: roleToJoin });
            setRole(res.data.member.role);
        } catch (error) {
            console.error(error);
        }
    }

    const handleLeave = async () => {
        try {
            await api.delete(`/groups/${groupId}/leave`);
            setRole(null);

        } catch (error) {
            console.error("Failed to leave group", error);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!group) return <div>Group not found</div>;

    return (
        <div className="space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {group.parentGroup && (
                        <Link to={`/group/${group.parentGroup._id}`} className="text-sm text-muted-foreground hover:underline mb-2 block">
                            &larr; Back to {group.parentGroup.name}
                        </Link>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
                    <p className="text-muted-foreground">{group.description}</p>
                </div>
                {user && (
                    <div className="flex gap-2">


                        {role === 'admin' && (
                            <Button onClick={() => setShowPostForm(!showPostForm)}>
                                {showPostForm ? 'Cancel' : 'Post News'}
                            </Button>
                        )}
                    </div>
                )}
            </div>


            {children.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-4">Faculties & Departments</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {children.map(child => (
                            <Link key={child._id} to={`/group/${child._id}`}>
                                <Card className="hover:bg-accent transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{child.name}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}


            {showPostForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post News</CardTitle>
                    </CardHeader>
                    <form onSubmit={handlePostNews}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <textarea
                                    id="content"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Publish</Button>
                        </CardFooter>
                    </form>
                </Card>
            )}


            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Latest News</h2>
                {newsList.length === 0 ? (
                    <p className="text-muted-foreground">No news posted yet.</p>
                ) : (
                    newsList.map(news => (
                        <Card key={news._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle>{news.title}</CardTitle>
                                        <CardDescription>
                                            Posted by {news.postedBy?.name} on {format(new Date(news.createdAt), 'PPP')}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{news.content}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </section>
        </div>
    );
}
