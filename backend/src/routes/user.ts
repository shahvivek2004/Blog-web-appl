import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt';
import { signinInput, signupInput } from "@project-blog/medium-common";


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

userRouter.post('/signup', async (c) => {

  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct"
    });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    });

    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json({ jwt: jwt, name: user.name });
  } catch (error) {
    c.status(411);
    return c.text('Invalid');
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct"
    });
  }


  try {
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      }
    });

    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect Credentials"
      });
    }

    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json({ jwt: jwt, name: user.name });
  } catch (error) {
    c.status(411);
    return c.text('Invalid');
  }
})

