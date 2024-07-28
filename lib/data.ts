import { prisma } from "@/lib/prisma";

export const getBills = async ( query = { query: "", startDate: new Date(), endDate: new Date() } ) => {
  console.log(query, 'query')
  try {
    const contacts = await prisma.bill.findMany({
      where: {
        AND: [{
          customer: {
            name: {
              contains: query?.query,
              mode: "insensitive"
            }
          }
        },
        {
          dateCreated: {
            gte: new Date(query?.startDate),
            lte: new Date(query?.endDate),
          }
        }
        ]
      },
      include: {
        customer: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        dateCreated: 'desc',
      }
    });

    return contacts;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

export const getCustomers = async (query: string) => {
  try {
    const contacts = await prisma.customer.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      orderBy: {
        id: 'desc',
      }
    });
    return contacts;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};
