export async function createGroup(app, db)
{
    app.post('/api/createGroup', async (req, res) =>{
        try
        {
            const {username , groupName} = req.body;
            // i need to have a function that will take in a userID and check if they have proper permission to be performing this task



        }
        catch(error)
        {

        }
    })
}