exports.seed = function(knex, Promise) {
  return knex("Roles").then(function() {
    return knex("Roles").insert([
      { id: 1, role: "Pomo" },
      { id: 2, role: "Alainen" },
      { id: 3, role: "Kollega" },
      { id: 4, role: "Asiakas" },
      { id: 5, role: "Lähipiiri" },
      { id: 6, role: "Kaveri" },
      { id: 7, role: "Opettaja" },
      { id: 8, role: "Minä itse" },
      { id: 9, role: "Muu" }
    ]);
  });
};
