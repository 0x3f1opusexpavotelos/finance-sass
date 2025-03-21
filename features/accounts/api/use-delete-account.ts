import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferResponseType } from "hono"

import { client } from "@/lib/hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id }
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Account Deleted")
      queryClient.invalidateQueries({ queryKey: ["accounts", { id }] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Failed to edit account")
    }
  })
  return mutation
}
