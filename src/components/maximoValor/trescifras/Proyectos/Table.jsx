import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react";
import Form from "./Form";
import useMaximoValorTresCifras from "../../../../hook/useValorMaximoTresCifras";
import DropdownMaximoValor from "./Dropdown";
import IconActions from "../../../../icons/IconActions";
import IconDescription from "../../../../icons/IconDescription";

export default function TableValorMaximo() {
  const { maximoValorTresCifras, ids, loading, error } =
    useMaximoValorTresCifras();

  const columns = [
    { name: "ID", icon: IconDescription },
    { name: "VALOR MAXIMO", icon: IconActions },
    { name: "ACTIONS", icon: IconActions },
  ];

  return (
    <>
      <section className="w-full flex flex-col md:justify-center md:items-center mb-10">
        <div className="w-full flex justify-center items-center">
          {loading && <p>Loading...</p>}
        </div>

        <div className="w-full flex justify-center items-center">
          {error && <p>{error.message}</p>}
        </div>

        {maximoValorTresCifras && maximoValorTresCifras ? (
          <div className="w-full flex items-end justify-end  text-sm px-4">
            Elimina el maximo valor para poder ingresar uno nuevo
          </div>
        ) : (
          <article
            className="w-[90%] md:max-w-[1200px] mx-auto flex justify-end 
             mt-2 mb-2 items-center"
          >
            <Form />
          </article>
        )}

        {!loading &&
          maximoValorTresCifras && ( // Agrega una verificación para que `user` exista
            <>
              <Table
                style={{
                  backgroundColor: "#000000",
                }}
                isStriped
                className="text-white rounded-xl w-full md:max-w-[1200px] mx-auto p-0 m-0 "
                aria-label="Example static collection table"
              >
                <TableHeader>
                  {columns.map((col, index) => (
                    <TableColumn
                      style={{
                        backgroundColor: "#000000",
                      }}
                      className="text-white shadow-2xl border-b-2 border-white rounded-xl"
                      key={index}
                    >
                      <p className="flex items-center gap-2 ">
                        {col.name} {col.icon && <col.icon />}
                      </p>
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{ids}</TableCell>
                    <TableCell>{maximoValorTresCifras}</TableCell>

                    <TableCell>
                      <DropdownMaximoValor
                        id={ids}
                        valor={maximoValorTresCifras}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
      </section>
    </>
  );
}
