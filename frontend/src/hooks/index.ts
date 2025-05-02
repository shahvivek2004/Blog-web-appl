import axios from "axios";
import { useEffect, useState } from "react"
import { BE_URL } from "../config";

export interface Blog {
    "content": string;
    "title": string;
    "id": number;
    "author": {
        "name": string
    }
    "publishDate": string
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();
    useEffect(() => {
        axios.get(`${BE_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(respone => {
            setBlog(respone.data.blog);
            setLoading(false);
        })
    }, [id]);

    return {
        loading,
        blog
    }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BE_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(respone => {
                setBlogs(respone.data.blog);
                setLoading(false);
            })
    }, []);

    return {
        loading,
        blogs
    }
}

export const useMyBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
            axios.get(`${BE_URL}/api/v1/blog/myblogs`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
                .then(respone => {
                    setBlogs(respone.data.blogs);
                    setLoading(false);
                })
        }, []);

    return { loading, blogs };
};