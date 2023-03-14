import { faker } from "@faker-js/faker";
import { useState } from "react";

export default function createRandomUser() {

  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    avatar: faker.image.avatar(),
    company: faker.company.name(),
  };
}
