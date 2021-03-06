import { Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ConsumedService } from './consumed.service';
import { Consumed } from './entities/consumed.entity';
import { CreateConsumedInput } from './dto/create-consumed.input';
import { UpdateConsumedInput } from './dto/update-consumed.input';
import { Ctx } from 'src/types/context.type';

@Resolver(() => Consumed)
export class ConsumedResolver {
    constructor(private readonly consumedService: ConsumedService) {}

    @Mutation(() => Consumed)
    createConsumed(
        @Args('createConsumedInput') createConsumedInput: CreateConsumedInput,
        @Context() context: Ctx,
    ) {
        return this.consumedService.create(createConsumedInput, context);
    }

    @Mutation(() => Consumed)
    updateConsumed(@Args('updateConsumedInput') updateConsumedInput: UpdateConsumedInput) {
        return this.consumedService.update(updateConsumedInput.id, updateConsumedInput);
    }

    @Mutation(() => Consumed)
    removeConsumed(@Args('id', { type: () => Int }) id: number) {
        return this.consumedService.remove(id);
    }
}
