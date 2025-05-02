import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from "@project-blog/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();


blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('authorization') || "";
    const user = await verify(authHeader, c.env.JWT_SECRET) as { id: string };
    if (user) {
        c.set("userId", user.id);
        console.log(user.id);
        await next();
    } else {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        });
    }

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    });

    return c.json({
        id: blog.id
    });
})


blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.findMany({
        select:{
            title:true,
            content:true,
            id:true,
            publishDate:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });

    return c.json({
        blog
    });
})

blogRouter.get('/myblogs', async(c) => {
    const id = c.get("userId");
    console.log(`Id : ${id}`);
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blogs = await prisma.blog.findMany({
            where: {
                authorId: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                publishDate: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log(blogs);

        return c.json({
            blogs
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while fetching user's blog posts"
        });
    }
});

// Edit option 
blogRouter.put('/:id', async (c) => {
    const body = await c.req.json();
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        });
    }
    
    const blog = await prisma.blog.update({
        where: {
            id: Number(id)
        },
        data: {
            title: body.title,
            content: body.content,
        }
    });

    return c.json({
        id: blog.id
    });
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            },
            select:{
                id:true,
                title:true,
                content:true,
                publishDate:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        });

        return c.json({
            blog
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while fetching blog post"
        });
    }
});


