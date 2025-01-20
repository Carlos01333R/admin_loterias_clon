import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react";

import useNumerosBloqueados from "../../../hook/useNumerosBloquedos";
import DropdownZona from "./Dropdown";
import Form from "./Form";
import { SearchIcon } from "../../../icons/SearchIcon";
import IconActions from "../../../icons/IconActions";
import IconDescription from "../../../icons/IconDescription";
import IconVscode from "../../../icons/IconVscode";
import { useState } from "react";

export default function TableBloqueo() {
  const [Filter, setFilter] = useState(null);
  const { numerosBloqueados, loading, error } = useNumerosBloqueados();

  const columns = [
    { name: "NUMERO", icon: IconDescription },
    { name: "VALOR MAXIMO", icon: IconActions },
    { name: "ACTIONS", icon: IconActions },
  ];

  const filterNameProyect = (numerosBloqueados) => {
    if (!numerosBloqueados) return []; // Asegúrate de que user no sea null
    if (Filter === null) return numerosBloqueados;
    return numerosBloqueados.filter((zona) =>
      zona.loteria.toLowerCase().includes(Filter.toLowerCase())
    );
  };

  const FilterProject = filterNameProyect(numerosBloqueados); // Validación adicional para evitar errores

  return (
    <>
      <section className="w-full flex flex-col md:justify-center md:items-center mb-10">
        <div className="w-full flex justify-center items-center">
          {loading && <p>Loading...</p>}
        </div>

        <div className="w-full flex justify-center items-center">
          {error && <p>{error.message}</p>}
        </div>

        {!loading && ( // Agrega una verificación para que `user` exista
          <>
            <article
              className="w-[90%] md:max-w-[1200px] mx-auto flex justify-end 
             mt-2 mb-2 items-center"
            >
              <Input
                isClearable
                className="w-full md:max-w-[30%]"
                placeholder="Search by name..."
                startContent={<SearchIcon />}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Form />
            </article>

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
                {FilterProject.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.numero}</TableCell>
                    <TableCell>{row.valor}</TableCell>

                    <TableCell>
                      <DropdownZona
                        id={row.id}
                        numero={row.numero}
                        valor={row.valor}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </section>
    </>
  );
}
