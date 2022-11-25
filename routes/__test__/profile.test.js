const request = require("supertest");
const app = require("../../app");

it("it return a 201 on successful profile creation", async () => {
  await request(app)
    .post("/profile")
    .send({
      name: "Falola Ibrahim A.",
      description: "Software Engineer",
    })
    .expect(201);
});

it("it return a 200 on fetch profile with ID", async () => {
  const res = await request(app)
    .post("/profile")
    .send({
      name: "Falola Ibrahim A.",
      description: "Software Engineer",
    })
    .expect(201);

  const { data } = res.body;
  const id = data._id;

  await request(app).get(`/profile/${id}`).expect(200);
});
