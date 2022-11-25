const request = require("supertest");
const app = require("../../app");

it("it return a 201 on successful comment creation", async () => {
  await request(app)
    .post("/comment")
    .send({
      title: "Just not an INTJ",
      comment:
        "I want Elon Musk to be an INTJ more than anyone, but the isn't.People think that Elon has Ni because of his long-term vision for humanity becoming a multi-planetary species, but the way he got to this conclusion is through Ti-Ne - by envisioning all the possibilities and choosing the Ti path the makes the most sense.Elon's mannerisms, jokes, are very based on Ne. He has so much Ne that I even considered ENTP, but INTP is the most likely choice; watch the video if you're still not convinced.",
      personality: [
        { type: "MBTI", value: "INFP" },
        { type: "Enneagram", value: "2w3" },
        { type: "Zodiac", value: "Aries" },
      ],
      profileID: "637f1f8fd8cafa78630f25b1",
    })
    .expect(201);
});

it("it return a 200 on liked comment", async () => {
  const res = await request(app)
    .post("/comment")
    .send({
      title: "Just not an INTJ",
      comment:
        "I want Elon Musk to be an INTJ more than anyone, but the isn't.People think that Elon has Ni because of his long-term vision for humanity becoming a multi-planetary species, but the way he got to this conclusion is through Ti-Ne - by envisioning all the possibilities and choosing the Ti path the makes the most sense.Elon's mannerisms, jokes, are very based on Ne. He has so much Ne that I even considered ENTP, but INTP is the most likely choice; watch the video if you're still not convinced.",
      personality: [
        { type: "MBTI", value: "INFP" },
        { type: "Enneagram", value: "2w3" },
        { type: "Zodiac", value: "Aries" },
      ],
      profileID: "637f1f8fd8cafa78630f25b1",
    });

  const { data } = res.body;
  const id = data._id;

  await request(app).post(`/comment/like/${id}`).expect(200);
});

it("it return a 200 on comment filter and sorting", async () => {
  const res = await request(app)
    .post("/comment")
    .send({
      title: "Just not an INTJ",
      comment:
        "I want Elon Musk to be an INTJ more than anyone, but the isn't.People think that Elon has Ni because of his long-term vision for humanity becoming a multi-planetary species, but the way he got to this conclusion is through Ti-Ne - by envisioning all the possibilities and choosing the Ti path the makes the most sense.Elon's mannerisms, jokes, are very based on Ne. He has so much Ne that I even considered ENTP, but INTP is the most likely choice; watch the video if you're still not convinced.",
      personality: [
        { type: "MBTI", value: "INFP" },
        { type: "Enneagram", value: "2w3" },
        { type: "Zodiac", value: "Aries" },
      ],
      profileID: "637f1f8fd8cafa78630f25b1",
    });

  const { data } = res.body;
  const id = data._id;

  await request(app).get(`/comment/?filter=MBTI&sort=best`).expect(200);
});
