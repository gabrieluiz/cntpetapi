module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Doacoes', [
          { nome: 'Fancy Feast', preco: 'R$ 35.00', descricao: 'Ração de gato', img: '/assets/fancy-feast.png', createdAt: new Date(), updatedAt: new Date() },
          { nome: 'Cesar', preco: 'R$ 46.00', descricao: 'Ração de cachorro', img: '/assets/cesar.png', createdAt: new Date(), updatedAt: new Date() },
      ]);
  },

  async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Doacoes', null, {});
  }
};
