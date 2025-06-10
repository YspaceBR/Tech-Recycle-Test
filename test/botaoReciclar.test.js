const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

describe('Template principal.handlebars', () => {
  let template;

  beforeAll(() => {
    const templatePath = path.resolve(__dirname, '../views/auth/principal.handlebars');
    console.log('Tentando carregar:', templatePath);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    template = handlebars.compile(templateSource);
  });

  it('deve conter o botão com classe pontos-reciclar', () => {
    const rendered = template({});
    expect(rendered).toContain('class="pontos-reciclar"');
    expect(rendered).toContain("window.location.href='/reciclar'");
  });

  it('deve conter o texto O que posso reciclar', () => {
    const rendered = template({});
    expect(rendered).toContain('<h4>O que posso reciclar</h4>');
  });

  it('deve conter o ícone de reciclagem', () => {
    const rendered = template({});
    expect(rendered).toContain('class="icon icon-tabler icons-tabler-outline icon-tabler-recycle"');
  });
});
