import { Footer } from "flowbite-react";

export default function KuFooter() {
  return (
    <Footer container className="rounded-none">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="/"
            src="/src/assets/images/logo.png"
            alt="Logo"
            name="Rapida Quickstart"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">Sobre</Footer.Link>
            <Footer.Link href="#">Política de Privacidade</Footer.Link>
            <Footer.Link href="#">Licenciamento</Footer.Link>
            <Footer.Link href="#">Contato</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright
          href="#"
          by="Rapida Quickstart™"
          year={new Date().getFullYear()}
        />
      </div>
    </Footer>
  );
}
